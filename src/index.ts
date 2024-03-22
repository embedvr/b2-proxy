import { AwsClient } from "aws4fetch";
import { Hono } from "hono";
import { cache } from "hono/cache";

const app = new Hono<{
	Bindings: {
		ACCESS_KEY_ID: string;
		ACCESS_KEY_SECRET: string;
		S3_URL: string;
	};
}>();

const initAwsClient = (accessKey: string, secretKey: string) => {
	return new AwsClient({
		accessKeyId: accessKey,
		secretAccessKey: secretKey,
		region: "us-east-1",
		service: "s3",
	});
};

// app.get(
// 	"*",
// 	cache({
// 		cacheName: "b2-proxy",
// 		cacheControl: "max-age=86400",
// 	})
// );

app.get("/", (c) => {
	return c.redirect("https://github.com/embedvr/b2-proxy", 302);
});

app.get("*", async (c) => {
	const awsClient = initAwsClient(
		c.env.ACCESS_KEY_ID,
		c.env.ACCESS_KEY_SECRET
	);
	console.log(`${c.env.S3_URL}${c.req.path}`);
	const item = awsClient.fetch(`${c.env.S3_URL}${c.req.path}`);
	return item;
});

export default app;
