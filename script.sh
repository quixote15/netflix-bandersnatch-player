ASSETSFOLDER=assets/timeline


for mediaFile in `ls $ASSETSFOLDER | grep .mp4`; do

## We will generate file in diferent resolutions
## replace resolutions config for practicity
FILENAME=$(echo $mediaFile | sed -n 's/.mp4//p' | sed -n 's/-1920x1080//p')
##echo $FILENAME

INPUT=$ASSETSFOLDER/$mediaFile

FOLDER_TARGET=$ASSETSFOLDER/$FILENAME
mkdir -p $FOLDER_TARGET

OUTPUT=$ASSETSFOLDER/$FILENAME/$FILENAME
DURATION=$(ffprobe -i $INPUT -show_format -v quiet | sed -n 's/duration=//p')

echo $DURATION
done