import StoryblokClient from "../../";

const Storyblok = new StoryblokClient({
  accessToken: "w0yFvs04aKF2rpz6F8OfIQtt"
});

describe("Storyblok JS Client", () => {
  it("should fetch all the stories", async () => {
    const { data } = await Storyblok.get("cdn/stories");
    expect(data.stories.length).toBe(25);
  });
});
