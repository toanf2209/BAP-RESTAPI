
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mảng chứa danh sách lớp học
let classes = [
    { id: 1, name: 'Lớp 12', SL:'54' },
    { id: 2, name: 'Lớp 11' ,SL:'34'},
    { id: 3, name: 'Lớp 10' ,SL:'76'},
  ];
  

// API lấy danh sách lớp học (có phân trang, tìm kiếm từ khóa, sort)
app.get('/api/v1/classes', (req, res) => {
  // Lấy thông tin phân trang từ query params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Lọc danh sách lớp học theo từ khóa (nếu có)
  let filteredClasses = classes;
  if (req.query.keyword) {
    const keyword = req.query.keyword.toLowerCase();
    filteredClasses = classes.filter(cls => cls.name.toLowerCase().includes(keyword));
  }

  // Sắp xếp danh sách lớp học (nếu có)
  if (req.query.sort === 'asc') {
    filteredClasses.sort((a, b) => a.name.localeCompare(b.name));
  } else if (req.query.sort === 'desc') {
    filteredClasses.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Tính toán index bắt đầu và index kết thúc của danh sách trả về
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = filteredClasses.slice(startIndex, endIndex);

  // Trả về danh sách lớp học đã lọc và phân trang
  res.json({
    total: filteredClasses.length,
    page,
    limit,
    data: results
  });
});

// API lấy thông tin của một lớp học theo id
app.get('/api/v1/classes/:id', (req, res) => {
  const classId = parseInt(req.params.id);
  const foundClass = classes.find(cls => cls.id === classId);

  if (foundClass) {
    res.json(foundClass);
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

// API tạo mới một lớp học
app.post('/api/v1/classes', (req, res) => {
  const newClass = {
    id: classes.length + 1,
    name: req.body.name,
    teacher: req.body.teacher
  };

  classes.push(newClass);
  res.status(201).json(newClass);
});

// API cập nhật thông tin của một lớp học
app.put('/api/v1/classes/:id', (req, res) => {
  const classId = parseInt(req.params.id);
  const foundClass = classes.find(cls => cls.id === classId);

  if (foundClass) {
    foundClass.name = req.body.name || foundClass.name;
    foundClass.teacher = req.body.teacher || foundClass.teacher;

    res.json(foundClass);
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

// API xóa một lớp học
app.delete('/api/v1/classes/:id', (req, res) => {
  const classId = parseInt(req.params.id);
  const classIndex = classes.findIndex(cls => cls.id === classId);

  if (classIndex !== -1) {
    classes.splice(classIndex, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Class not found' });
  }
});

// Khởi chạy server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});