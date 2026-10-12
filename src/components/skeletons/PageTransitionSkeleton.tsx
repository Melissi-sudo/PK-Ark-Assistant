import React from 'react';
import { useLocation } from 'react-router-dom';
import { LibraryHubSkeleton } from './LibraryHubSkeleton';
import { CalculatorSkeleton } from './CalculatorSkeleton';

interface PageTransitionSkeletonProps {
  customPath?: string;
}

export const PageTransitionSkeleton: React.FC<PageTransitionSkeletonProps> = ({ customPath }) => {
  const location = useLocation();
  const path = customPath || location.pathname;

  if (path === '/' || path === '/library') {
    return <LibraryHubSkeleton />;
  }

  if (path.startsWith('/minecraft')) {
    return <CalculatorSkeleton type="minecraft" theme="purple" />;
  }

  if (path.startsWith('/terraria') || path.startsWith('/bosses') || path.startsWith('/evil') || path.startsWith('/terraria-guide')) {
    return <CalculatorSkeleton type="terraria" theme="emerald" />;
  }

  if (path.startsWith('/rust')) {
    return <CalculatorSkeleton type="rust" theme="orange" />;
  }

  if (path === '/soakers') {
    return <CalculatorSkeleton type="soakers" theme="cyan" />;
  }

  if (path === '/raiding') {
    return <CalculatorSkeleton type="raiding" theme="cyan" />;
  }

  if (path === '/kibble') {
    return <CalculatorSkeleton type="recipe" theme="emerald" />;
  }

  if (path === '/breeding') {
    return <CalculatorSkeleton type="breeding" theme="emerald" />;
  }

  if (path === '/taming') {
    return <CalculatorSkeleton type="taming" theme="cyan" />;
  }

  if (path.startsWith('/maps')) {
    return <CalculatorSkeleton type="maps" theme="cyan" />;
  }

  if (path === '/resources') {
    return <CalculatorSkeleton type="resources" theme="cyan" />;
  }

  if (path === '/pyromane') {
    return <CalculatorSkeleton type="generic" theme="cyan" />;
  }

  return <CalculatorSkeleton type="generic" theme="cyan" />;
};
