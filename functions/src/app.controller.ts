import { Controller, Get } from "@nestjs/common";
import { Public } from "./decorators/public.decorator";
@Controller()
export class AppController {
  @Get("health")
  @Public()
  health(): { status: "ok" } {
    return {
      status: "ok",
    };
  }
}
