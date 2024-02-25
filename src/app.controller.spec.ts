import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it("should return proper message", () => {
      expect(appController.getHello()).toBe(
        '<h1>Backend for <a href="https://cesarczyk.dev" >cesarczyk.dev</a> portfolio up and running 🚀</h1>',
      );
    });
  });
});
