package com.stream.app.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stream.app.entity.Video;

@Repository
public interface IVideoRepository extends JpaRepository<Video, String>{
	
	Optional<Video> findByTitle(String title);

}
