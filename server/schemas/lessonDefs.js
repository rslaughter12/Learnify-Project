const { gql } = require('apollo-server-express');

const { Lesson, Tutorial } = require('../models');


const lessonTypeDefs = gql`
  type Lesson {
    _id: ID!
    name: String
    body: String
    media: String
    duration: Int
  }

  type Query {
    lessons: [Lesson]
    lesson(_id: ID!): Lesson
  }

  type Mutation {
    addLesson(tutorialId: ID!, name: String!, body: String!, media: String, duration: Int!): Lesson

    updateLesson(_id: ID!, name: String, body: String media: String, duration: Int): Lesson
    
    deleteLesson(_id: ID!): Lesson
  }
`;

//Resolvers for Lesson typeDefs
const lessonResolvers = {
  Query: {
    //get all lessons
    lessons: async () => {
      return await Lesson.find({});
    },
    //get a single lesson by id
    lesson: 
        async (parent, { _id }) => {
            return await Lesson.findById(_id);
        },
  },

  Mutation: {
    //ADD a new lesson and attach it to its tutorial
    addLesson: async (parent, { tutorialId, name, body, media, duration }) => {
       
      const newLesson = await Lesson.create({ name, body, media, duration });

      await Tutorial.findByIdAndUpdate(
        tutorialId,
        { $push: {lessons: newLesson._id } },
        { new: true }
      );

      return newLesson;

    },
    
    //UPDATE one or more fields for an existing lesson
    updateLesson: async (parent, {_id, name, body, media, duration}) => {
      //create object containing only field(s) to be updated
      const updates = {};
      if (name) {
        updates.name = name;
      }
      if (body) {
        updates.body = body;
      }
      if (media) {
        updates.media = media;
      }
      if (duration) {
        updates.duration = duration;
      }

      return await Lesson.findByIdAndUpdate(
        _id, 
        { $set: updates }, 
        {new: true }
        );
    },

    //DELETE a lesson
    deleteLesson: async (parent, {_id}) => {
      return await Lesson.findByIdAndDelete(_id);
    }
}
};

module.exports = { lessonTypeDefs, lessonResolvers };