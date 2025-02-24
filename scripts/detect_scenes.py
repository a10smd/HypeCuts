import argparse
from scenedetect import detect, ContentDetector

def main(video_path):
    scene_list = detect(video_path, ContentDetector())
    timestamps = [int(scene[1].get_seconds()) for scene in scene_list]
    print(','.join(map(str, timestamps)))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--video', type=str, required=True)
    args = parser.parse_args()
    main(args.video)
