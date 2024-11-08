package com.stream.app.service;

import java.io.File;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import javax.management.RuntimeErrorException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.stream.app.entity.Video;
import com.stream.app.repo.IVideoRepository;

import jakarta.annotation.PostConstruct;

// 26min 49sec

@Service
public class VideoServiceImpl implements IVideoService {
	@Autowired
	IVideoRepository videoRepo;

	@Value("${files.video}")
	String DIR;

	@Value("${files.video.hsl}")
	String HSL_DIR;

	@PostConstruct
	public void init() {
		File file = new File(DIR);

		File file1 = new File(HSL_DIR);

		if (!file1.exists()) {
			file1.mkdir();
		}

		if (!file.exists()) {
			file.mkdir();
			System.out.println("Folder Created");
		} else {
			System.out.println("Folder already created");
		}
	}

	@Override
	public Video save(Video video, MultipartFile file) {
		try {
			String filename = file.getOriginalFilename();
			String contentType = file.getContentType();
			InputStream inputStream = file.getInputStream();
			// folder path : create
			String cleanFileName = StringUtils.cleanPath(filename);
			String cleanFolder = StringUtils.cleanPath(DIR);

			Path path = Paths.get(cleanFolder, cleanFileName);
			System.out.println(contentType);
			System.out.println(path);
			// folder path with filename

			// copy file to the folder
			Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);

			// video meta-deta
			video.setContentType(contentType);
			video.setFilePath(path.toString());
			Video video2 = videoRepo.save(video);
			processVideo(video.getVideoId());
			// metadata save

			return video2;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	@Override
	public Video get(String videoId) {
		Video video = videoRepo.findById(videoId).orElseThrow(() -> new RuntimeException("Video not found!"));

		return video;
	}

	@Override
	public Video getByTitle(String title) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Video> getAll() {
		return videoRepo.findAll();
	}

	@Override
	public String processVideo(String videoId) {
		Video video = this.get(videoId);
		String filePath = video.getFilePath();

		// Path where to store data;
		Path videoPath = Paths.get(filePath);

		String output360p = HSL_DIR + videoId + "/360p/";
		String output720p = HSL_DIR + videoId + "/720p/";
		String output1080p = HSL_DIR + videoId + "/1080p/";
		try {
			Files.createDirectories(Paths.get(output360p));
			Files.createDirectories(Paths.get(output720p));
			Files.createDirectories(Paths.get(output1080p));

			// ffmpeg command
			Path outputPath = Paths.get(HSL_DIR, videoId);
			Files.createDirectories(outputPath);
//
//			String ffmpegCmd = String.format(
//					"ffmpeg -i \"%s\" -c:v libx264 -c:a aac -strict -2 " + "-f hls -hls_time 10 -hls_list_size 0 "
//							+ "-hls_segment_filename \"%s/segment_%%3d.ts\" " + "\"%s/master.m3u8\"",
//					videoPath, outputPath);
			
			String ffmpegCmd = String.format(
				    "ffmpeg -i \"%s\" " +
				    "-map 0:v:0 -s:v:0 640x360 -b:v:0 800k -map 0:a:0 " +
				    "-map 0:v:0 -s:v:1 1280x720 -b:v:1 2800k -map 0:a:0 " +
				    "-map 0:v:0 -s:v:2 1920x1080 -b:v:2 5000k " +
				    "-f hls -hls_time 10 -hls_list_size 0 " +
				    "-hls_segment_filename \"%s/segment_%%3d.ts\" " +
				    "\"%s/master.m3u8\"",
				    videoPath, outputPath, outputPath);



//			StringBuilder ffmpegCmd = new StringBuilder();
//			ffmpegCmd.append("ffmpeg -i")
//			.append(videoPath.toString())
//			.append(" ")
//			.append("-map 0:v -map 0:a -s:v:0 640*360 -b:v:0 800k ")
//			.append("-map 0:v -map 0:a -s:v:1 1280*720 -b:v:1 2800k ")
//			.append("-map 0:v -map 0:a -s:v:2 1920*1080 -b:v:2 5000k ")
//			.append("-var_stream_map \"V:0,a:0 v:1,a:0 v:2,a:0\" ")
//			.append("-master_pl_name ")
//			.append(HSL_DIR)
//			.append(videoId)
//			.append("/master.m3u8 ")
//			.append("-f hls -hls_time 10 -hls_list_size 0 ")
//			.append("-hls_segment_filename \"")
//			.append(HSL_DIR)
//			.append(videoId)
//			.append()
			
			System.out.println(ffmpegCmd);
			// file this command
			ProcessBuilder processBuilder = new ProcessBuilder("/bin/bash","-c",ffmpegCmd.toString());
			processBuilder.inheritIO();
			Process process = processBuilder.start();
			int exit = process.waitFor();
			if(exit != 0) {
				
				throw new RuntimeException("Video Processing Failed!!!");
			}
			System.out.println("VideoServiceImpl.processVideo()");
			return videoId;

		} catch (Exception ex) {
			ex.printStackTrace();
			throw new RuntimeException("Video processing failed!!!");
		}

	}

}
