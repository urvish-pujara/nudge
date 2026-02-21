#!/usr/bin/env python3
"""Generate app icons in multiple sizes from nudge.png"""

import os
from PIL import Image

# Path to source image
source_image = "public/nudge.png"

# Android icon sizes (in dp, but we'll generate at 2x size for hdpi baseline)
android_sizes = {
    "android/app/src/main/res/mipmap-mdpi": 48,
    "android/app/src/main/res/mipmap-hdpi": 72,
    "android/app/src/main/res/mipmap-xhdpi": 96,
    "android/app/src/main/res/mipmap-xxhdpi": 144,
    "android/app/src/main/res/mipmap-xxxhdpi": 192,
}

# iOS icon sizes
ios_sizes = {
    "20x20": 20,
    "29x29": 29,
    "40x40": 40,
    "60x60": 60,
    "1024x1024": 1024,
}

# Assets folder copies
asset_sizes = {
    "assets/icons": [64, 128, 256],
    "assets/images": [512, 1024],
}

def generate_icons():
    """Generate all required icon sizes"""
    
    # Check if source image exists
    if not os.path.exists(source_image):
        print(f"Error: {source_image} not found")
        return False
    
    # Open source image
    img = Image.open(source_image)
    print(f"Source image size: {img.size}")
    
    # Generate Android icons
    print("\nGenerating Android icons...")
    for dir_path, size in android_sizes.items():
        os.makedirs(dir_path, exist_ok=True)
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # Save ic_launcher.png
        icon_path = os.path.join(dir_path, "ic_launcher.png")
        resized.save(icon_path, "PNG")
        print(f"  ✓ {icon_path} ({size}x{size})")
        
        # Save ic_launcher_round.png (same for now)
        round_icon_path = os.path.join(dir_path, "ic_launcher_round.png")
        resized.save(round_icon_path, "PNG")
        print(f"  ✓ {round_icon_path} ({size}x{size})")
    
    # Generate iOS icons
    print("\nGenerating iOS icons...")
    ios_dir = "ios/Nudge/Images.xcassets/AppIcon.appiconset"
    os.makedirs(ios_dir, exist_ok=True)
    
    for size_name, size in ios_sizes.items():
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        
        # For iOS, we need to generate multiple scales
        scales = [1, 2, 3] if size < 1024 else [1]  # 1024 is only 1x
        
        for scale in scales:
            actual_size = size * scale
            if actual_size <= max(ios_sizes.values()):
                scaled = img.resize((actual_size, actual_size), Image.Resampling.LANCZOS)
                icon_path = os.path.join(ios_dir, f"AppIcon-{size}-{scale}x.png")
                scaled.save(icon_path, "PNG")
                print(f"  ✓ {icon_path} ({actual_size}x{actual_size})")
    
    # Generate asset folder icons
    print("\nGenerating asset icons...")
    for dir_path, sizes in asset_sizes.items():
        os.makedirs(dir_path, exist_ok=True)
        for size in sizes:
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            icon_path = os.path.join(dir_path, f"nudge-{size}.png")
            resized.save(icon_path, "PNG")
            print(f"  ✓ {icon_path} ({size}x{size})")
    
    # Copy original to assets
    os.makedirs("assets/images", exist_ok=True)
    import shutil
    shutil.copy(source_image, "assets/images/nudge.png")
    print(f"  ✓ assets/images/nudge.png (original)")
    
    print("\n✓ All icons generated successfully!")
    return True

if __name__ == "__main__":
    try:
        generate_icons()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
