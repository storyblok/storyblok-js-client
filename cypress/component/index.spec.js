import { mount } from "@cypress/vue";
import TestingPlayground from "../TestingPlayground.vue";

const prepare = (options) => mount(TestingPlayground, { props: { options } });

describe("storyblok-js-client", () => {
  it("fetches correctly a story", () => {
    prepare({ accessToken: "w0yFvs04aKF2rpz6F8OfIQtt" });

    cy.get("[data-test=stories]").should("have.text", "25");
  });
});
