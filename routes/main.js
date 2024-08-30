import express from "express";
import checkAuth from "../middlewares/auth.js";
import Team from "../models/team.js";
import User from "../models/user.js";
const router = express.Router();

router.post('/teams/:hub', async (req, res) => {
    try {
        console.log(req.originalUrl);
        const { hub } = req.params;
        const teams = await Team.find({ hub });
        if (teams.length == 0) {
            return res.status(400).json({
                status: "error",
                errorCode: "TEAMS_NOT_FOUND",
                message: "Teams not found",
            });
        }
        return res.status(200).json({
            status: "success",
            data: {
                teams
            },
            message: "Teams fetched successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            errorCode: "INTERNAL_SERVER_ERROR",
            message: error.message,
        });
    }
});

router.route('/team/:name')
    .post(async (req, res) => {
        try {
            console.log(req.originalUrl);
            const { name } = req.params;
            const team = await Team.findOne({ name });
            if (!team) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "TEAM_NOT_FOUND",
                    message: "Team not found",
                });
            }
            return res.status(200).json({
                status: "success",
                data: {
                    team
                },
                message: "Team fetched successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                errorCode: "INTERNAL_SERVER_ERROR",
                message: error.message,
            })
        }
    })
    .put(async (req, res) => {
        try {
            const { _id } = req.params;
            const { taskCode, taskStatus } = req.body;
            const team = await Team.findById(_id);
            if (!team) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "TEAM_NOT_FOUND",
                    message: "Team not found",
                })
            }
            const user = await User.findById(req.user._id);
            if (!user || !user.task) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "USER_NOT_FOUND",
                    message: "User not found",
                });
            }
            if (user.role === 'scanner') {
                if ((!(taskCode == `Desafio of task ${user.task} completed`) && taskStatus == 'mid') || taskStatus == 'high') {
                    return res.status(403).json({
                        status: "error",
                        errorCode: "ACCESS_DENIED",
                        message: "Unauthorized access",
                    });
                }
                if (team.tasks[user.task - 1] === taskStatus) {
                    return res.status(400).json({
                        status: "error",
                        errorCode: `task_already_${taskStatus}`,
                        message: `Task already ${taskStatus}`
                    })
                }
                team.tasks[user.task - 1] = taskStatus;
            }
            else if (user.role === 'admin') {
                if (team.tasks[user.task - 1] === 'taskStatus') {
                    return res.status(400).json({
                        status: "error",
                        errorCode: `task_already_${taskStatus}`,
                        message: `Task already ${taskStatus}`
                    });
                }
                team.tasks[user.task - 1] = taskStatus;
            }
            await team.save();
            return res.status(200).json({
                status: "success",
                message: "Task updated successfully",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "error",
                errorCode: "INTERNAL_SERVER_ERROR",
                message: error.message,
            });
        }
    });

export default router;