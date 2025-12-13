import cv2
import numpy as np

def extract_path(image_path):
    # Load image (handling non-ASCII paths)
    try:
        # Read file as byte array
        img_array = np.fromfile(image_path, np.uint8)
        # Decode image
        img = cv2.imdecode(img_array, cv2.IMREAD_UNCHANGED)
    except Exception as e:
        print(f"Error loading image: {e}")
        return

    if img is None:
        print(f"Error: Could not load image at {image_path}")
        return

    print(f"Image shape: {img.shape}")

    # Extract mask
    mask = None
    if img.shape[2] == 4:
        alpha = img[:, :, 3]
        if np.min(alpha) == 255:
            print("Alpha channel is fully opaque. Ignoring alpha.")
        else:
            print("Using Alpha channel for masking.")
            _, mask = cv2.threshold(alpha, 10, 255, cv2.THRESH_BINARY)

    if mask is None:
        print("Using color thresholding (assuming dark shield on light background).")
        # Convert to gray
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        # Invert threshold: darker parts become white (foreground)
        # Auto threshold utilizing Otsu
        _, mask = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        print("No contours found.")
        return

    # Get the largest contour (assuming it's the shield)
    c = max(contours, key=cv2.contourArea)

    # Simplify contour
    epsilon = 0.005 * cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, epsilon, True)

    # Generate SVG path data
    path_data = "M"
    for point in approx:
        x, y = point[0]
        path_data += f"{x},{y} "
    path_data += "Z"

    print("--- SVG Path Data ---")
    print(path_data)
    print("---------------------")

    # Write to file
    with open('shield_path.txt', 'w') as f:
        f.write(path_data)

    return path_data

if __name__ == "__main__":
    # Correct path to the uploaded image
    # Note: Path separator might need adjustment depending on OS, but python handles forward slashes usually fine.
    # U:\2026src\vns-masakinihirota.worktrees\anti\public\vns-logos\VNSアイコン 2025-12-13 081457.png
    # Mapping to relative path for safer execution or absolute.
    # Worktree root is u:\2026src\vns-masakinihirota.worktrees\anti

    img_path = r"u:\2026src\vns-masakinihirota.worktrees\anti\public\vns-logos\VNSアイコン 2025-12-13 081457.png"
    extract_path(img_path)
