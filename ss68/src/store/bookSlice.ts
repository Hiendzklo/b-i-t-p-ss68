// src/store/bookSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { Book } from '../types/book';

export interface BookState {
  books: Book[];
}

const initialState: BookState = {
  books: JSON.parse(localStorage.getItem('books') || '[]'),
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks(state, action: PayloadAction<Book[]>) {
      state.books = action.payload;
    },
    addBook(state, action: PayloadAction<Book>) {
      state.books.push(action.payload);
    },
    updateBook(state, action: PayloadAction<Book>) {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    removeBook(state, action: PayloadAction<number>) {
      state.books = state.books.filter(book => book.id !== action.payload);
    },
  },
});

export const { setBooks, addBook, updateBook, removeBook } = bookSlice.actions;
export const selectBooks = (state: RootState) => state.books.books;
export default bookSlice.reducer;
