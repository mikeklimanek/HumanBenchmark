from PIL import ImageGrab
import pyautogui
import time

def is_color_present(color, bbox=(0, 0, 248, 209)):
    screen = ImageGrab.grab(bbox=bbox)
    for x in range(screen.width):
        for y in range(screen.height):
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
        # time.sleep(0.1)

if __name__ == "__main__":
    main()
