import { jsdom } from "jsdom";

import adInitOriginal from "../ad-init";
import { makeAdInitMocks, adInit } from "./ad-init-mocks";
import { expectFunctionToBeSerialisable } from "./check-serialisable-function";

jest.useFakeTimers();

describe("Ad init", () => {
  let mock;
  let initOptions;

  beforeEach(() => {
    const adInitMocks = makeAdInitMocks();
    mock = adInitMocks.mock;
    initOptions = adInitMocks.initOptions;
  });

  it("is serialisable", () => {
    expectFunctionToBeSerialisable(adInitOriginal);
  });

  it("performs page-level setup for the first slot only", () => {
    const init1 = adInit(initOptions);
    const init2 = adInit(initOptions);

    jest.spyOn(init1, "doPageAdSetupAsync").mockImplementation();
    jest.spyOn(init2, "doPageAdSetupAsync").mockImplementation();

    init1.init();
    init2.init();

    expect(init1.doPageAdSetupAsync).toHaveBeenCalledTimes(1);
    expect(init2.doPageAdSetupAsync).toHaveBeenCalledTimes(0);
    expect(init1.gpt.doSlotAdSetup).toHaveBeenCalledTimes(1);
    expect(init2.gpt.doSlotAdSetup).toHaveBeenCalledTimes(1);
  });

  it("throws if the init hook is called twice", () => {
    const init = adInit(initOptions);
    init.init();
    expect(() => init.init()).toThrowError(
      new Error("init() has already been called")
    );
  });

  it.skip("Dispatches the renderComplete event when GPT initialises", () => {
    // TODO
  });

  it.skip("Initialises services in parallel", () => {
    // TODO test that GPT, grapeshot and prebidding are initialised in parallel
    // TODO test promise chain using promise-mock to mock out services e.g. grapeshot.setupAsync
  });

  it.skip("Displays ads after all services are initialised", () => {
    // TODO test promise chain using promise-mock to mock out services e.g. grapeshot.setupAsync
  });

  it.skip("Applies prebidding targeting after all services are initialised", () => {
    // TODO test promise chain using promise-mock
  });
});
