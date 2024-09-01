import express from "express";
import checkAuth from "../middlewares/auth.js";
import Team from "../models/team.js";
import User from "../models/user.js";
const router = express.Router();

router.post('/teams/:hub', checkAuth, async (req, res) => {
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
                teams,
                user: req.user.role
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

router.route('/team/:_id')
    .post(checkAuth, async (req, res) => {
        try {
            console.log(req.originalUrl);
            const { _id } = req.params;
            const team = await Team.findById(_id);
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
                    team,
                    user: req.user.role
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
    .put(checkAuth, async (req, res) => {
        try {
            console.log(req.body)
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
            console.log("i am printing the user here", user)
            if (!user || (!user.task && user.role === 'scanner')) {
                return res.status(400).json({
                    status: "error",
                    errorCode: "USER_NOT_FOUND",
                    message: "User not found",
                });
                
            }
            console.log(user.task)
            console.log("true or not",!(taskCode == `Desafio of task ${user.task} completed`))
            console.log(`Desafio of task ${user.task} completed`)
            if (user.role === 'scanner') {
                if ((!(taskCode == `Desafio of task ${user.task} completed`)) || taskStatus == 'high') {
                    return res.status(403).json({
                        status: "error",
                        errorCode: "ACCESS_DENIED",
                        message: "Unauthorized access",
                    });
                }
                if (team.tasks[user.task - 1] === "low") {
                    return res.status(400).json({
                        status: "error",
                        errorCode: `task_not_assigned`,
                        message: `Task not assigned yet`
                    })
                }
                if (team.tasks[user.task - 1] === "mid") {
                    return res.status(400).json({
                        status: "error",
                        errorCode: `task_already_scanned`,
                        message: `Already Scanned`
                    })
                }
                team.tasks[user.task - 1] = "mid";
            }
            else if (user.role === 'admin') {
                if (team.tasks[taskCode] === taskStatus) {
                    return res.status(400).json({
                        status: "error",
                        errorCode: `task_already_${taskStatus}`,
                        message: `Task already ${taskStatus}`
                    });
                }
                team.tasks[taskCode] = taskStatus;
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