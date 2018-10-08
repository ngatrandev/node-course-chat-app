const path = require('path');
const publicPath = path.join(__dirname, "../public");//__dirname là đường dẫn đến folder server dùng join() sẽ tạo đường dẫn đến folder public
const express = require('express');
const app = express();
const port = process.env.PORT || 8080
app.use(express.static(publicPath));// middleware qua public folder

app.listen(port, () => {
console.log(`Server is up on port ${port}`);
})