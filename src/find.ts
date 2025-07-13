import z from "zod";
import { database } from "./db";

const posts_schema = z.array(z.object({
    id: z.number(),
    topic: z.number(),
    hash: z.number(),
    user: z.string(),
    content: z.string()
}))

const topics = new Map(z.array(z.object({
    id: z.number(), title: z.string()
})).parse(database.query("SELECT * FROM topics").all()).map(e=>[e.id, e.title]));

export const find = (key: string, topic?: number) => {
    const result = topic !== undefined ?
        database.query("SELECT * FROM posts WHERE topic = ? AND content LIKE ?").all(topic, `%${key}%`) :
        database.query("SELECT * FROM posts WHERE content LIKE ?").all(`%${key}%`);
    return posts_schema.parse(result);
}

const [,, key, topic] = process.argv;
if(!key) console.log("usage: find [key] [topic?]");
else {
    let topic_i = topic ? parseInt(topic) : undefined;
    if(topic_i !== undefined && isNaN(topic_i))
        topic_i = undefined;

    console.clear();

    const find_start = Bun.nanoseconds();
    const result = find(key, topic_i);
    const find_end = Bun.nanoseconds();

    result.forEach(e=>{
        console.error(`
${topics.get(e.topic)!}#${e.hash} @${e.user} ( https://scratch.mit.edu/discuss/post/${e.id}/ )`);
        console.log(e.content);
    })

    console.log(`find: ${find_end-find_start}ns`);
    console.log(`results count: ${result.length}`);
}