import flashcards.word_list as word_list
import flashcards.api as api

import tkinter as tk
from tkinter import filedialog as fd
from tkinter import messagebox
from pathlib import Path
import random


class Application(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.create_widgets()
        self.pack(expand=True)
        self.words = None
        self.current_word = None
        self.current_definition = None

    def create_widgets(self):

        self.load_words_button = tk.Button(self)
        self.load_words_button["text"] = "Load words"
        self.load_words_button["command"] = self.load_words_func
        self.load_words_button.grid(row=0, column=0, padx=10, pady=10, sticky='nsew')

        self.next_button = tk.Button(self)
        self.next_button["text"] = "=>"
        self.next_button["state"] = "disabled"
        self.next_button["command"] = self.get_random_word_and_definition
        self.next_button.grid(row=0, column=1, padx=10, pady=10, sticky='nsew')
    
        self.quit = tk.Button(self, text="QUIT", fg="red", command=self.master.destroy)
        self.quit.grid(row=0, column=2, padx=10, pady=10, sticky='nsew')

        self.flashcard = tk.Button(self, width=100, height=30)
        self.flashcard["text"] = "Load words to continue..."
        self.flashcard["state"] = "disabled"
        self.flashcard["command"] = self.flip_text
        self.flashcard.grid(row=1, column=0, columnspan=3, padx=10, pady=10, sticky='nsew')

        self.grid_columnconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)
        self.grid_columnconfigure(2, weight=1)
        self.grid_rowconfigure(0, weight=1)
        self.grid_rowconfigure(1, weight=1)

    def load_words_func(self):
        filename = fd.askopenfilename()
        try:
            self.words = word_list.get_word_list(Path(filename))
            self.flashcard["state"] = "normal"
            self.next_button["state"] = "normal"
            self.get_random_word_and_definition()
        except ValueError as e:
            self.words = None
            self.current_word = None
            self.current_definition = None
            self.flashcard["text"] = "Load words to continue..."
            self.flashcard["state"] = "disabled"
            self.next_button["state"] = "disabled"
            messagebox.showinfo("Error", str(e))

    def flip_text(self):
        if self.flashcard["text"] == self.current_word:
            self.flashcard["text"] = self.current_definition
        else:
            self.flashcard["text"] = self.current_word

    def get_random_word_and_definition(self):
        word_idx = random.randint(0, len(self.words)-1)
        self.current_word = self.words[word_idx]
        self.current_definition = api.get_definition(self.current_word)
        self.flashcard["text"] = self.current_word


root = tk.Tk()
root.title("Flashcards")
root.geometry("960x640")
app = Application(master=root)
app.mainloop()
