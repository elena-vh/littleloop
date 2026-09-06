import { Project, deleteProject, listProjects } from '@src/db/projectsRepo';
import React, { useState, useCallback } from 'react';
import { Alert, FlatList, Pressable, Text } from 'react-native';
import ProjectRow from './ProjectRow';
import EmptyStateCard from '../ui/EmptyStateCard';
import { ProjectsCarousel } from '../ui/ProjectsCarousel';
import { router, useFocusEffect } from 'expo-router';

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);

  // const refresh = () => setProjects(listProjects());

  const handleDelete = (id: string) => {
    Alert.alert('Delete project?', 'This will remove it from your list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProject(id);
          refresh();
        },
      },
    ]);
  };
  const refresh = useCallback(() => {
    setProjects(listProjects());
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );
  return (
    <ProjectsCarousel
      data={projects}
      onPressItem={(item) => router.push(`/projects/${item.id}`)}
    />
    // <FlatList
    //   data={projects}
    //   keyExtractor={(p) => p.id}
    //   renderItem={({ item }) => (
    //     <ProjectRow onDelete={handleDelete} project={item} />
    //   )}
    //   ListEmptyComponent={
    //     <EmptyStateCard message='✨ Cast on your first project!' />
    //   }
    // />
  );
}
