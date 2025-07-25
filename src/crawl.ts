import { JSDOM } from "jsdom";
import { database } from "./db";

class FetchQueue {
    static interval = 5000;
    queue: (() => Promise<void>)[] = [];
    timer: NodeJS.Timeout | null = null;

    enqueue(url: string | URL){
        const { promise, resolve, reject } = Promise.withResolvers<Response>();
        this.queue.push(() => {
            console.time(`fetch ${url}`);
            return fetch(url).then(e => {
                if(!e.ok) throw new Error(`${url} is error`, { cause: e });
                console.timeEnd(`fetch ${url}`);
                resolve(e);
            }).catch(reject)
        });

        if(!this.timer) this.process();

        return promise;
    }
    async process(){
        const task = this.queue.shift();
        if(task){
            await task();
            this.timer = setTimeout(() => this.process(), FetchQueue.interval);
        }
    }
    cancel(){
        if(this.timer) clearTimeout(this.timer);
    }
}

const fetchqueue = new FetchQueue;

fetchqueue.process();

const searchSQL = database.prepare("SELECT * FROM posts WHERE topic = ? AND hash = ?");

async function crawlPosts(topic: number, i: number){
    // 20ページ単位であることを元に計算 最後の1pはわざとクロールする仕組み
    if(searchSQL.get(topic, 20 * i + 1)){
        console.log(`already crawled ${i}`);
        return;
    }

    const res = await fetchqueue.enqueue(`https://scratch.mit.edu/discuss/topic/${topic}/?page=${i}`);

    console.timeEnd(`dom ${i}`);
    const dom = new JSDOM(await res.text());
    console.timeEnd(`dom ${i}`);

    console.time(`contents ${i}`);
    dom.window.document.querySelectorAll(".blockpost.roweven.firstpost").values().toArray().forEach(el=>
        database.query("INSERT OR IGNORE INTO posts (id, topic, hash, user, content) VALUES (?,?,?,?,?)").all(
            parseInt(/\/(\d+)\/$/.exec(el.querySelector(".box-head a")?.getAttribute("href")!)![1]!),
            topic,
            parseInt(el.querySelector(".conr")!.textContent.substring(1)),
            el.querySelector(".username")!.textContent,
            el.querySelector(".post_body_html")!.textContent));
    console.timeEnd(`contents ${i}`);
}
const topic = parseInt(process.argv[2]??"");
const f = await fetchqueue.enqueue(`https://scratch.mit.edu/discuss/topic/${topic}/`);

if(!f.ok){
    console.error(`Failed to fetch: ${f.status} ${f.statusText}`);
}else{
    const dom = new JSDOM(await f.text());
    const title = dom.window.document.querySelector(".linkst ul li:nth-last-child(1)")!.childNodes[0]!.textContent!.substring(2);
    console.log(title);

    const max = parseInt(dom.window.document.querySelector(".pagination a:nth-last-child(2)")!.textContent);

    database.query("INSERT OR IGNORE INTO topics (id, title) VALUES (?, ?)").all(topic, title.trim());

    Array(max).fill(0).forEach((_,i)=>
        crawlPosts(topic, i+1));
}
