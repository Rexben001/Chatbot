const express = require("express");
// will use this later to send requests
const http = require("http");
// import env variables
require("dotenv").config();

const axios = require("axios");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("Server is working.");
});

app.post("/getmovie", (req, res) => {
  //   try {
  const movieToSearch =
    req.body.result &&
    req.body.result.parameters &&
    req.body.result.parameters.movie
      ? req.body.result.parameters.movie
      : "";

  const reqUrl = encodeURI(
    `http://www.omdbapi.com/?t=${movieToSearch}&apikey=${process.env.API_KEY}`
  );
  // const reqUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${movieToSearch}`;
  http.get(
    reqUrl,
    responseFromAPI => {
      let completeResponse = "";
      responseFromAPI.on("data", chunk => {
        completeResponse += chunk;
      });
      responseFromAPI.on("end", () => {
        const movie = JSON.parse(completeResponse);

        console.log(movie, completeResponse), movieToSearch;
        let dataToSend = movieToSearch;
        dataToSend = `${movie.Title} was released in the year ${movie.Year}. It is directed by ${movie.Director} and stars ${movie.Actors}.\n Here some glimpse of the plot: ${movie.Plot}.
                    }`;

        return res.json({
          fulfillmentText: dataToSend,
          source: "getmovie"
        });
      });
    },
    error => {
      return res.json({
        fulfillmentText: "Could not get results at this time",
        source: "getmovie"
      });
    }
  );
  //     const movieResult = await axios.get(reqUrl.replace(" ", "%20"));
  //     const response = movieResult.data.results[0];
  //     const dataToSend = `${response.title} was released in the year ${response.release_date}.`;
  //     res.status(200).json({
  //       fulfillmentText: dataToSend,
  //       source: "getmovie"
  //     });
  //   } catch (error) {
  //     res.status(500).json({ error });
  //   }
});

app.listen(port, () => {
  console.log(`🌏 Server is running at http://localhost:${port}`);
});
