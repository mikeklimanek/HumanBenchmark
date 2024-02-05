########################################################################
###   !!!THIS SCRIPT ONLY WORKS ON WINDOWS OPERATING SYSTEM!!!       ###
########################################################################
#   ImageGrab will not work for browser opened in windows OS if you    #
#   are using WSL (Windows Subsystem for Linux) to run this script.    #

from PIL import ImageGrab
import time
import pyautogui   # bash command:  pip install pyautogui pillow before running

def is_color_present(color, bbox=(0, 0, 248, 209)):     # you might need to
    screen = ImageGrab.grab(bbox=bbox)                  # change the bbox
    for x in range(screen.width):                       # according to your
        for y in range(screen.height):                  # screen resolution
            r, g, b = screen.getpixel((x, y))
            if (r, g, b) == color:
                return True
    return False

def click_mouse():
    pyautogui.click()

def main():
    green_color = (75,219,106)
    while True:
        if is_color_present(green_color):
            click_mouse()
            print("Clicked")
        # time.sleep(0.1)   # uncomment this line if you want to slow down the loop

if __name__ == "__main__":
    main()

