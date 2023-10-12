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
        res.json({ status: "success", message: 'Movie retrieved successfully', movie });
    } catch (e) {
        res.status(500).json({ error: 'An error occurred while retrieving movie' });
    }
}

export async function GetMovies(req: Request, res: Response) {
    const { q, page } = req.query;
    if (q) {
        try {
            const movies = await Movie.findAll({
                where: {
                    name: {
                        [Op.like]: `%${q}%`
                    }
                }
            });

            const currentPage = page ? parseInt(page as string) - 1 : 0;
            const perPage = 10;
            if (movies.length < perPage) {
                res.json({ status: "success", message: 'Movies retrieved successfully', movies });
            }
            const pageItems = movies.slice(currentPage * 10, currentPage * 10 + 10);
            res.json({ status: "success", message: 'Movies retrieved successfully', movies: pageItems });

        } catch (e) {
            res.status(500).json({ error: 'An error occurred while retrieving movies', movies: [] });
        }
        return;
    }
    try {
        const movies = await Movie.findAll();
        const currentPage = page ? parseInt(page as string) - 1 : 0;
        const perPage = 10;
        if (movies.length < perPage) {
            res.json({ status: "success", message: 'Movies retrieved successfully', movies });
        }
        const pageItems = movies.slice(currentPage * 10, currentPage * 10 + 10);
        res.json({ status: "success", message: 'Movies retrieved successfully', movies: pageItems });

    } catch (e) {
        res.status(500).json({ error: 'An error occurred while retrieving movies', movies: [] });
    }
}


export async function AddMovie(req: Request, res: any) {
    const { name, duration, rating } = req.body;
    try {
        const movie = await Movie.create({ name, duration, rating });
        res.json({ status: "success", message: 'Movie added successfully', movie });
    } catch (e) {
        res.status(500).json({ error: 'An error occurred while adding the movie' });
    }
}

export async function PrepareCSV(req: Request, res: Response) {
    const movies = await Movie.findAll();
    // Convert data to CSV format
    let csvContent = 'ID, Name, Duration, Rating\n';
    movies.forEach((row: any) => {
        csvContent += `${row.id}, ${row.name}, ${row.duration}, ${row.rating}\n`;
    });

    // Create a CSV file
    fs.writeFileSync('data.csv', csvContent);

    // Serve the file for download
    res.download('data.csv', 'data.csv', (err) => {
        if (err) {
            res.status(500).send('Error while downloading the file.');
        }
    });
}

export async function PrepareTXT(req: Request, res: Response) {
    const movies = await Movie.findAll();
    // Convert data to CSV format
    let csvContent = 'ID, Name, Duration, Rating\n';
    movies.forEach((row: any) => {
        csvContent += `${row.id}, ${row.name}, ${row.duration}, ${row.rating}\n`;
    });

    // Create a CSV file
    fs.writeFileSync('data.txt', csvContent);

    // Serve the file for download
    res.download('data.txt', 'data.txt', (err) => {
        if (err) {
            res.status(500).send('Error while downloading the file.');
        }
    });
}

export async function EditMovie(req: Request, res: Response) {
    const { id, movie } = req.body;
    try {
        const result = Movie.update({ name: movie.name, duration: movie.duration, rating: movie.rating }, { where: { id } });
        res.json({ status: "success", message: 'Movie updated successfully', result });
    } catch (e) {
        res.status(500).json({ error: 'An error occurred while updating the movie' });
    }

}


export async function DeleteMovie(req: Request, res: Response) {

}


