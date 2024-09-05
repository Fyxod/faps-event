import fs from 'fs';
import path from 'path';
import express from 'express';
import getISTDateString from '../utils/getDate.js';
import url from 'url';

const app = express();

const excludedExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg'];

export default function requestLogger(req, _, next) {
    try {
        const parsedUrl = url.parse(req.originalUrl);
        const extension = path.extname(parsedUrl.pathname);
        
        const timestamp = getISTDateString();
        const method = req.method;
        const ip = req.headers['do-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const log = `${timestamp} | ${method} ${req.originalUrl} | ${ip}\n`;

        const allRequestsLogPath = path.join(path.resolve(), 'all_requests.log');

        const filteredLogPath = path.join(path.resolve(), 'filtered_requests.log');

        fs.appendFile(allRequestsLogPath, log, (err) => {
            if (err) {
                console.error('Failed to write all requests log:', err);
            }
        });

        // Log only non-static requests to 'filtered_requests.log'
        if (!excludedExtensions.includes(extension)) {
            fs.appendFile(filteredLogPath, log, (err) => {
                if (err) {
                    console.error('Failed to write filtered log:', err);
                }
            });
        }

        next();
    } catch (error) {
        console.error(error);
        next();
    }
};
