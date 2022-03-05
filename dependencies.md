## FFmpeg & ffprobe

Perform the steps below to install FFmpeg 3.x on Ubuntu 18.04:

1. Start by updating the packages list:

   `sudo apt update`

2. Next, install FFmpeg by typing the following command:

`sudo apt install ffmpeg`

3. To validate that the package is installed properly use the ffmpeg -version command which prints the FFmpeg version:

`ffmpeg -version`

The output should look something like this:

```
    ffmpeg version 3.4.4-0ubuntu0.18.04.1 Copyright (c) 2000-2018 the FFmpeg developers
    built with gcc 7 (Ubuntu 7.3.0-16ubuntu3)
```

4. To print all available FFmpeg’s encoders and decoders type:

```
ffmpeg -encoders
ffmpeg -decoders
```

That’s it. FFmpeg 3 is now installed on your system, and you can start using it.
Installing FFmpeg 4.x on Ubuntu

## MP4Box

1. Install Subversion

First of all, you need to install subversion to available ‘svn’ command.

`apt-get install subversion`

2. Download MP4Box (GPAC)

Download the latest ‘gpac’ from the svn repository.

`svn co https://svn.code.sf.net/p/gpac/code/trunk/gpac gpac`

3. Configure MP4Box (GPAC)

Configure the source package.

```
 cd gpac

 ./configure --disable-opengl --use-js=no --use-ft=no --use-jpeg=no --use-png=no --use-faad=no --use-mad=no --use-xvid=no --use-ffmpeg=no --use-ogg=no --use-vorbis=no --use-theora=no --use-openjpeg=no

 make

 make install

 cp bin/gcc/libgpac.so /usr/lib

```

4. Verify MP4Box (GPAC)

Verify the installation using the following command:

# MP4Box -version

## References

https://linuxize.com/post/how-to-install-ffmpeg-on-ubuntu-18-04/
https://www.techoism.com/install-mp4box-gpac/
