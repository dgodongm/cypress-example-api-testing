/* eslint-env mocha */
describe("todos API", () => {
  const initialItems = [
    {
      id: 1,
      task: "read something",
    },
    {
      id: 2,
      task: "write something",
    },
  ];

  const getItems = () => cy.request("/todos").its("body");

  const getItem = (item) => cy.request(`/todos/${item.id}`).its("body");

  const add = (item) => cy.request("POST", "/todos", item);

  const deleteItem = (item, options = { log: true }) =>
    cy.request({
      method: "DELETE",
      url: `/todos/${item.id}`,
      log: options.log,
    });

  const deleteAll = () =>
    getItems().each((item) => deleteItem(item, { log: false }));

  const reset = () => {
    deleteAll();
    initialItems.forEach(add);
  };

  beforeEach(reset);

  it("returns JSON", () => {
    cy.request("/todos")
      .its("headers")
      .its("content-type")
      .should("include", "application/json");
  });

  it("loads 2 items", () => {
    getItems().should("have.length", 2);
  });

  it("loads the initial items", () => {
    getItems().should("deep.equal", initialItems);
  });

  it("returns id + task objects", () => {
    getItems().each((value) => expect(value).to.have.all.keys("id", "task"));
  });

  it("add an item", () => {
    const randomId = Cypress._.random(0, 10000);
    const item = { id: randomId, task: "life" };

    add(item);
    getItem(item).should("deep.equal", item);
  });

  it("deletes an item", () => {
    deleteItem(initialItems[0]);
    getItems().should("have.length", 1);
  });
});
