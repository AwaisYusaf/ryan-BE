import { Router } from "express";
import { GetMovies, AddMovie, EditMovie, DeleteMovie, PrepareCSV, PrepareTXT, GetMovieByID } from "../controllers/moviesControllers";
const moviesRouter = Router();

moviesRouter.route("/").get(GetMovies).post(AddMovie).put(EditMovie).delete(DeleteMovie);
moviesRouter.route("/:id").get(GetMovieByID);

moviesRouter.route("/download-csv").get(PrepareCSV);
moviesRouter.route("/download-txt").get(PrepareTXT);


export default moviesRouter;