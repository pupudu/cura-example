import express from 'express';

const router = express.Router();

router.get('/exampleEndpoint', (req, res) => {
  console.log(req.headers.token);
  setTimeout(() => {
    res.json({
      message: "Hello Universal App"
    })
  }, 5000);
});

export default router;