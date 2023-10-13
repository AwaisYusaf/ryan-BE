import { Request, Response } from "express";
import { DataTypes } from "sequelize";
import { sequelize } from "../database/getConn";
import { Op } from "sequelize";
import fs from "fs";



const Movie = sequelize.define('Movie', {
    name: DataTypes.STRING,
    duration: DataTypes.STRING,
    rating: DataTypes.STRING,
});

sequelize.sync();


export async function GetMovieByID(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const movie = await Movie.findOne({ where: { id } });
        return res.json({ status: "success", message: 'Movie retrieved successfully', movie });
    } catch (e) {
        return res.status(500).json({ error: 'An error occurred while retrieving movie' });
    }
}




function sortByNameAscending(arr: any[]) {
    arr.sort((a, b) => {
        if (a.name.toLowerCase()[0] > b.name.toLowerCase()[0]) {
            return -1;
        }
        return 1;
    });
}
function sortByNameDescending(arr: any[]) {
    arr.sort((a, b) => {
        if (a.name.toLowerCase()[0] < b.name.toLowerCase()[0]) {
            return -1;
        }
        return 1;
    });
}

function sortByRatingAscending(arr: any[]) {
    arr.sort((a, b) => {
        if (a.rating < b.rating) {
            return -1;
        }
        return 1;
    });
}

function sortByRatingDescending(arr: any[]) {
    arr.sort((a, b) => {
        if (a.rating > b.rating) {
            return -1;
        }
        return 1;
    });
}

function sortMovies(arr: any[], sort?: string) {
    if (!sort) {
        return;
    }
    if (sort === 'name_asc') {
        sortByNameAscending(arr);
    } else if (sort === 'name_desc') {
        sortByNameDescending(arr);
    } else if (sort === 'rating_asc') {
        sortByRatingAscending(arr);
    } else if (sort === 'rating_desc') {
        sortByRatingDescending(arr);
    }
}

export async function GetMovies(req: Request, res: Response) {
    const { q, page, sort } = req.query;
    console.log("SORT=", sort)

    if (q) {
        try {
            const movies = await Movie.findAll({
                where: {
                    name: {
                        [Op.like]: `%${q}%`
                    }
                }
            });
            //Update Movie to Get the Latest Movie First
            movies.reverse();

            const currentPage = page ? parseInt(page as string) - 1 : 0;
            const perPage = 10;
            if (movies.length < perPage) {
                sortMovies(movies, sort as string);
                res.json({ status: "success", message: 'Movies retrieved successfully', movies });
            }
            const pageItems = movies.slice(currentPage * 10, currentPage * 10 + 10);
            sortMovies(pageItems, sort as string);
            return res.json({ status: "success", message: 'Movies retrieved successfully', movies: pageItems });

        } catch (e) {
            return res.status(500).json({ error: 'An error occurred while retrieving movies', movies: [] });
        }
    }
    try {
        const movies = await Movie.findAll();
        //Update Movie to Get the Latest Movie First
        movies.reverse();
        const currentPage = page ? parseInt(page as string) - 1 : 0;
        const perPage = 10;
        if (movies.length < perPage) {
            sortMovies(movies, sort as string);
            return res.json({ status: "success", message: 'Movies retrieved successfully', movies });
        }
        const pageItems = movies.slice(currentPage * 10, currentPage * 10 + 10);
        sortMovies(pageItems, sort as string);
        return res.json({ status: "success", message: 'Movies retrieved successfully', movies: pageItems });

    } catch (e) {
        return res.status(500).json({ error: 'An error occurred while retrieving movies', movies: [] });
    }
}


export async function AddMovie(req: Request, res: any) {
    const { name, duration, rating } = req.body;
    try {
        const movie = await Movie.create({ name, duration, rating });
        return res.json({ status: "success", message: 'Movie added successfully', movie });
    } catch (e) {
        return res.status(500).json({ error: 'An error occurred while adding the movie' });
    }
}

export async function PrepareCSV(req: Request, res: Response) {
    const movies = await Movie.findAll();
    //Update Movie to Get the Latest Movie First
    movies.reverse();

    // Convert data to CSV format
    let csvContent = 'ID, Name, Duration, Rating\n';
    movies.forEach((row: any) => {
        csvContent += `${row.id}, ${row.name}, ${row.duration}, ${row.rating}\n`;
    });

    // Create a CSV file
    fs.writeFileSync('data.csv', csvContent);

    // Serve the file for download
    return res.download('data.csv', 'data.csv', (err) => {
        if (err) {
            res.status(500).send('Error while downloading the file.');
        }
    });
}

export async function PrepareTXT(req: Request, res: Response) {
    const movies = await Movie.findAll();
    //Update Movie to Get the Latest Movie First
    movies.reverse();
    // Convert data to CSV format
    let csvContent = 'ID, Name, Duration, Rating\n';
    movies.forEach((row: any) => {
        csvContent += `${row.id}, ${row.name}, ${row.duration}, ${row.rating}\n`;
    });

    // Create a CSV file
    fs.writeFileSync('data.txt', csvContent);

    // Serve the file for download
    return res.download('data.txt', 'data.txt', (err) => {
        if (err) {
            return res.status(500).send('Error while downloading the file.');
        }
    });
}

export async function EditMovie(req: Request, res: Response) {
    const { id, movie } = req.body;
    try {
        const result = Movie.update({ name: movie.name, duration: movie.duration, rating: movie.rating }, { where: { id } });
        return res.json({ status: "success", message: 'Movie updated successfully', result });
    } catch (e) {
        return res.status(500).json({ error: 'An error occurred while updating the movie' });
    }

}


export async function DeleteMovie(req: Request, res: Response) {
    const { id } = req.params;
    try {
        await Movie.destroy({ where: { id } });
        return res.status(200).json({ status: "success", message: 'Movie deleted successfully' });
    } catch (e) {
        return res.status(500).json({ error: 'An error occurred while retrieving movie' });
    }
}


