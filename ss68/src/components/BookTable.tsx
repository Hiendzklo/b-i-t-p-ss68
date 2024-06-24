import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { Book } from '../types/book';
import { addBook, setBooks, removeBook, updateBook } from '../store/bookSlice';

const BookTable: React.FC = () => {
  const books = useAppSelector((state) => state.books.books);
  const dispatch = useAppDispatch();

  const [isFormVisible, setFormVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [newBook, setNewBook] = useState<Book>({
    id: books.length + 1,
    title: '',
    student: '',
    borrowDate: '',
    returnDate: '',
    status: 'Chưa trả',
  });

  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  useEffect(() => {
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      dispatch(setBooks(JSON.parse(storedBooks)));
    }
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handleAddBook = () => {
    if (!newBook.title || !newBook.student || !newBook.borrowDate || !newBook.returnDate) {
      alert('Tất cả các trường không được phép để trống');
      return;
    }
    const borrowDate = new Date(newBook.borrowDate);
    const returnDate = new Date(newBook.returnDate);
    const currentDate = new Date();
    if (borrowDate < currentDate || returnDate < currentDate) {
      alert('Ngày mượn và ngày trả không được bé hơn ngày hiện tại');
      return;
    }

    if (isEditMode) {
      const updatedBooks = books.map(book => book.id === newBook.id ? newBook : book);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      dispatch(setBooks(updatedBooks));
      setEditMode(false);
    } else {
      const updatedBooks = [...books, { ...newBook, id: books.length + 1 }];
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      dispatch(addBook(newBook));
    }

    setFormVisible(false);
    setNewBook({
      id: books.length + 2,
      title: '',
      student: '',
      borrowDate: '',
      returnDate: '',
      status: 'Chưa trả',
    });
  };

  const handleDeleteBook = (book: Book) => {
    setBookToDelete(book);
    setDeleteConfirmVisible(true);
  };

  const confirmDeleteBook = () => {
    if (bookToDelete) {
      const updatedBooks = books.filter(book => book.id !== bookToDelete.id);
      localStorage.setItem('books', JSON.stringify(updatedBooks));
      dispatch(setBooks(updatedBooks));
      setDeleteConfirmVisible(false);
      setBookToDelete(null);
    }
  };

  const handleEditBook = (book: Book) => {
    setNewBook(book);
    setFormVisible(true);
    setEditMode(true);
  };

  const handleStatusChange = (book: Book, status: string) => {
    const updatedBook = { ...book, status };
    const updatedBooks = books.map(b => b.id === book.id ? updatedBook : b);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    dispatch(setBooks(updatedBooks));
  };

  const filteredBooks = filterStatus
    ? books.filter(book => book.status === filterStatus)
    : books;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quản lý mượn trả sách</h1>
      <div className="mb-4">
        <label className="mr-2">Lọc theo trạng thái:</label>
        <select
          value={filterStatus || ''}
          onChange={(e) => setFilterStatus(e.target.value || null)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Tất cả</option>
          <option value="Đã trả" className="text-green-600">Đã trả</option>
          <option value="Chưa trả" className="text-red-600">Chưa trả</option>
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="w-full bg-gray-100 text-left">
            <th className="p-2 border-b">STT</th>
            <th className="p-2 border-b">Tên sách</th>
            <th className="p-2 border-b">Sinh viên mượn</th>
            <th className="p-2 border-b">Ngày mượn</th>
            <th className="p-2 border-b">Ngày trả</th>
            <th className="p-2 border-b">Trạng thái</th>
            <th className="p-2 border-b">Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book: Book, index: number) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border-b">{index + 1}</td>
              <td className="p-2 border-b">{book.title}</td>
              <td className="p-2 border-b">{book.student}</td>
              <td className="p-2 border-b">{book.borrowDate}</td>
              <td className="p-2 border-b">{book.returnDate}</td>
              <td className="p-2 border-b">
                <select
                  value={book.status}
                  onChange={(e) => handleStatusChange(book, e.target.value)}
                  className={`p-1 border border-gray-300 rounded ${book.status === "Đã trả" ? "text-green-600" : "text-red-600"}`}
                >
                  <option value="Đã trả" className="text-green-600">Đã trả</option>
                  <option value="Chưa trả" className="text-red-600">Chưa trả</option>
                </select>
              </td>
              <td className="p-2 border-b">
                <button
                  className="bg-blue-500 text-white px-2 py-1 mr-2 rounded"
                  onClick={() => handleEditBook(book)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteBook(book)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button 
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded" 
        onClick={() => {
          setFormVisible(true);
          setEditMode(false);
        }}
      >
        Thêm thông tin
      </button>

      {isFormVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{isEditMode ? "Cập nhật thông tin mượn sách" : "Thêm thông tin mượn sách"}</h2>
              <button className="text-gray-500" onClick={() => setFormVisible(false)}>X</button>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Tên sách</label>
              <input 
                type="text" 
                name="title" 
                value={newBook.title} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Tên người mượn</label>
              <input 
                type="text" 
                name="student" 
                value={newBook.student} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Ngày mượn</label>
              <input 
                type="date" 
                name="borrowDate" 
                value={newBook.borrowDate} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Ngày trả</label>
              <input 
                type="date" 
                name="returnDate" 
                value={newBook.returnDate} 
                onChange={handleInputChange} 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button 
              className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleAddBook}
            >
              {isEditMode ? "Cập nhật" : "Thêm"}
            </button>
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setFormVisible(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {isDeleteConfirmVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p className="mb-4">Bạn có chắc chắn muốn xóa thông tin mượn sách này?</p>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded mr-2"
              onClick={confirmDeleteBook}
            >
              Xóa
            </button>
            <button 
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => setDeleteConfirmVisible(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;
