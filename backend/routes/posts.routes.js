const express = require('express');
const axios = require('axios');
const { UserModel } = require('../models/users.models');
const { postModel} = require("../models/post.model")
const ExcelJS = require('exceljs');
const postRouter = express.Router();

postRouter.get('/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await UserModel.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
      const posts = response.data;
  
      const responseData = {
        user: {
          name: user.name,
          company: user.company
        },
        posts
      };
  
      res.status(200).json(responseData);
    } catch (error) {
      console.error('Error fetching posts for user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  postRouter.post('/bulk-add', async (req, res) => {
    try {
      const { user, posts } = req.body; 
        console.log(user)
        console.log(posts)
      await UserModel.findOrCreate({ where: { name: user.name }, defaults: { company: user.company } });
  
      const postsWithUserId = posts.map(post => ({ ...post, defaults:{userId: user.id }}));
  
      await postModel.bulkCreate(postsWithUserId);
  
      res.status(200).json({ success: true, message: 'Posts added successfully' });
    } catch (error) {
      console.error('Error adding posts:', error);
      res.status(500).json({ success: false, message: 'Failed to add posts' });
    }
  });


  postRouter.get('/download-excel/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      const userPosts = await postModel.findAll({ where: { userId } });
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Posts');
  
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'UserID', key: 'userId', width: 10 },
        { header: 'Title', key: 'title', width: 50 },
        { header: 'Body', key: 'body', width: 100 }
      ];
  
      userPosts.forEach(post => {
        worksheet.addRow(post.toJSON());
      });
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="user_${userId}_posts.xlsx"`);
  
      await workbook.xlsx.write(res);
      res.end();
  
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ success: false, message: 'Failed to generate Excel file' });
    }
  });
module.exports={
    postRouter
}