import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.grard";
import { AdminModule } from "./admin/admin.module";
import { UserModule } from "./user/user.module";
import { configInfo as conf } from "./common/config";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: conf.sql.host,
      port: conf.sql.port,
      username: conf.sql.username,
      password: conf.sql.password,
      database: conf.sql.database,
      synchronize: true,
      retryDelay: 1000,
      retryAttempts: 5,
      autoLoadEntities: true,
    }),
    AdminModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
