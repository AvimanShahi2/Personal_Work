import tkinter as tk
import time

class PomodoroTimer:
    def __init__(self, root):
        self.root = root
        self.root.title("Pomodoro Timer")
        self.root.geometry("350x300")  # Adjusted window size
        self.root.configure(bg="#f0f0f0")  # Set background color

        self.work_time = 1 * 60  # 25 minutes
        self.short_break_time = int(self.work_time * 0.05)  # 5% of work time
        self.long_break_time = int(self.work_time * 0.1)  # 10% of work time
        self.current_time = self.work_time

        self.is_running = False
        self.paused = False
        self.cycle_count = 0
        self.original_time = self.work_time

        self.label = tk.Label(root, text="Pomodoro Timer", font=("Arial", 24), bg="#f0f0f0", fg="#333333")
        self.label.pack(pady=10)

        self.time_label = tk.Label(root, text=self.format_time(self.current_time), font=("Arial", 48), bg="#f0f0f0", fg="#007bff")
        self.time_label.pack()

        self.break_frame = tk.Frame(root, bg="#f0f0f0")
        self.break_frame.pack(side=tk.TOP, pady=10)

        self.short_break_button = tk.Button(self.break_frame, text="Short Break", font=("Arial", 14), bg="#ffc107", fg="#333333", relief="raised", bd=2, padx=12, pady=6, command=self.take_short_break)
        self.short_break_button.pack(side=tk.LEFT, padx=10)

        self.long_break_button = tk.Button(self.break_frame, text="Long Break", font=("Arial", 14), bg="#28a745", fg="#ffffff", relief="raised", bd=2, padx=12, pady=6, command=self.take_long_break)
        self.long_break_button.pack(side=tk.RIGHT, padx=10)

        self.start_button = tk.Button(root, text="Start", font=("Arial", 14), bg="#007bff", fg="#ffffff", relief="raised", bd=2, padx=12, pady=6, command=self.start_timer)
        self.start_button.pack(side=tk.LEFT, padx=20, pady=10)

        self.reset_button = tk.Button(root, text="Reset", font=("Arial", 14), bg="#dc3545", fg="#ffffff", relief="raised", bd=2, padx=12, pady=6, command=self.reset_timer)
        self.reset_button.pack(side=tk.RIGHT, padx=20, pady=10)

    def format_time(self, seconds):
        minutes = seconds // 60
        seconds = seconds % 60
        return f"{minutes:02}:{seconds:02}"

    def update_timer(self):
        if self.is_running and not self.paused:
            if self.current_time > 0:
                self.current_time -= 1
                self.time_label.config(text=self.format_time(self.current_time))
                self.root.after(1000, self.update_timer)
            else:
                self.cycle_count += 1
                if self.cycle_count % 8 == 0:
                    self.current_time = self.long_break_time
                    self.label.config(text="Long Break")
                elif self.cycle_count % 2 == 0:
                    self.current_time = self.short_break_time
                    self.label.config(text="Short Break")
                else:
                    self.current_time = self.original_time
                    self.label.config(text="Work Time")
                self.time_label.config(text=self.format_time(self.current_time))
                self.root.after(1000, self.update_timer)

    def start_timer(self):
        if not self.is_running:
            self.is_running = True
            self.paused = False
            self.update_timer()

    def reset_timer(self):
        self.is_running = False
        self.paused = False
        self.cycle_count = 0
        self.current_time = self.work_time
        self.original_time = self.work_time
        self.label.config(text="Pomodoro Timer")
        self.time_label.config(text=self.format_time(self.current_time))
        # Enable the buttons on reset
        self.short_break_button.config(state="normal")
        self.long_break_button.config(state="normal")

    def take_short_break(self):
        if not self.is_running:
            self.original_time = self.short_break_time
            self.current_time = self.short_break_time
            self.label.config(text="Short Break")
            self.time_label.config(text=self.format_time(self.current_time))
            # Disable the button after it's used
            self.short_break_button.config(state="disabled")
        else:
            self.paused = True
            self.root.after(int(self.short_break_time * 1000), self.resume_timer)

    def take_long_break(self):
        if not self.is_running:
            self.original_time = self.long_break_time
            self.current_time = self.long_break_time
            self.label.config(text="Long Break")
            self.time_label.config(text=self.format_time(self.current_time))
            # Disable the button after it's used
            self.long_break_button.config(state="disabled")
        else:
            self.paused = True
            self.root.after(int(self.long_break_time * 1000), self.resume_timer)

    def resume_timer(self):
        self.paused = False
        self.update_timer()

# Create the main window
root = tk.Tk()
app = PomodoroTimer(root)
root.mainloop()
