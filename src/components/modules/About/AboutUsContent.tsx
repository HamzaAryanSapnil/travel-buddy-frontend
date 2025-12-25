/* eslint-disable @typescript-eslint/no-explicit-any */
import { projectConfig } from "@/config/project.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function AboutUsContent() {
  const { mission, overview, features, techStack, repositories } =
    projectConfig;

  // Helper to get icon component by name
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as Record<string, any>)[iconName];
    return IconComponent || LucideIcons.Info;
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-8 animate-in fade-in slide-in-from-bottom duration-700">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          {projectConfig.projectName}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          {projectConfig.projectTagline}
        </p>
        <p className="text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
          {projectConfig.projectDescription}
        </p>
      </section>

      {/* Mission Section */}
      <section className="animate-in fade-in slide-in-from-bottom duration-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {mission.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {mission.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {mission.problemsSolved.map((problem, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-xl">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {problem.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Overview Section */}
      <section className="animate-in fade-in slide-in-from-bottom duration-700">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
          Overview
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          {overview.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base animate-in fade-in slide-in-from-bottom duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Features Section - Role-based */}
      <section className="animate-in fade-in slide-in-from-bottom duration-700">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          Features
        </h2>
        <div className="space-y-12">
          {/* Admin Features */}
          {features.admin && features.admin.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">Admin Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.admin.map((feature, index) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow h-full animate-in fade-in slide-in-from-bottom duration-700"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* User Features */}
          {features.user && features.user.length > 0 && (
            <div>
              <h3 className="text-2xl font-semibold mb-6">User Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.user.map((feature, index) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow h-full animate-in fade-in slide-in-from-bottom duration-700"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="animate-in fade-in slide-in-from-bottom duration-700">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h3 className="text-xl font-semibold mb-4">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.frontend.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <h3 className="text-xl font-semibold mb-4">Backend</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.backend.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
          <div className="animate-in fade-in slide-in-from-right duration-700">
            <h3 className="text-xl font-semibold mb-4">Services</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.services.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="animate-in fade-in duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Repositories Section */}
      {(repositories.frontend || repositories.backend) && (
        <section className="animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            GitHub Repositories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repositories.frontend && (
              <Card className="hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-left duration-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaGithub className="w-5 h-5" />
                    {repositories.frontend.name}
                  </CardTitle>
                  <CardDescription>
                    {repositories.frontend.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={repositories.frontend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Repository
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            {repositories.backend && (
              <Card className="hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-right duration-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaGithub className="w-5 h-5" />
                    {repositories.backend.name}
                  </CardTitle>
                  <CardDescription>
                    {repositories.backend.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link
                      href={repositories.backend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Repository
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
