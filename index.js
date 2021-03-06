const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Course" type defines the queryable fields for every book in our data source.
  type Course {
    id: Int
    title: String
    author: String
    description: String
    topic: String
    url: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "courses" query returns an array of zero or more Course (defined above).

  type Query {
    course(id: Int!): Course
    courses(topic: String): [Course]
    coursesTitle(title: String!): [Course]
  }
`;

const coursesData = [
  {
    id: 1,
    title: "The Complete Node.js Developer Course",
    author: "Andrew Mead, Rob Percival",
    description:
      "Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs/",
  },
  {
    id: 2,
    title: "Node.js, Express & MongoDB Dev to Deployment",
    author: "Brad Traversy",
    description:
      "Learn by example building & deploying real-world Node.js applications from absolute scratch",
    topic: "Node.js",
    url: "https://codingthesmartway.com/courses/nodejs-express-mongodb/",
  },
  {
    id: 3,
    title: "JavaScript: Understanding The Weird Parts",
    author: "Anthony Alicea",
    description:
      "An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.",
    topic: "JavaScript",
    url: "https://codingthesmartway.com/courses/understand-javascript/",
  },
];

const resolvers = {
  Query: {
    // courses: () => coursesData,
    course(parent, args, context, info) {
      return coursesData.filter((course) => {
        return course.id === args.id;
      })[0];
    },
    courses(parent, args, context, info) {
      if (args.topic) {
        return coursesData.filter((course) => course.topic === args.topic);
      } else {
        return coursesData;
      }
    },
    coursesTitle(parent, args, context, info) {
      const lowerTitle = args.title.toLowerCase();

      return coursesData.filter((course) =>
        course.title.toLowerCase().includes(lowerTitle)
      );
    },
  },
  Mutation: {
    updateTopic(_, args, context, info) {
      const { id, topic } = args;

      coursesData.forEach((course) => {
        if (course.id === id) {
          course.topic = topic;
          return course;
        }
      });
      console.log(coursesData);
      return coursesData.filter((course) => course.id === id)[0];
    },
    course(_, args, context, info) {
      const course = args.course;

      coursesData.push(course);
      return coursesData;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`????  Server ready at ${url}`);
});
