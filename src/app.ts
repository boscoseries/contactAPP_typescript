import express from "express";
import createError from "http-errors";
import path from "path";
import logger from "morgan";
import "./models/connection";

import indexRouter from "./routes/index";
import contactRouter from "./routes/contact";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

app.use("/", indexRouter);
app.use("/api/contacts", contactRouter);

app.all("*", (_req, res) => {
  res.status(400).json({
    message: "invalid path"
  });
});

// catch 404 and forward to error handler
app.use(function(_req, _res, next: express.NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: express.Request, res: express.Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
