"use client";

import React, { useState } from 'react'
import { Search, Filter, Users, Calendar, Star, Award, Zap, Briefcase, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import "./style.css"

const mockGuilds = [
  {
    id: '1',
    name: 'Web Developers Guild',
    description: 'A community of passionate web developers creating cutting-edge web applications and pushing the boundaries of web technologies.',
    memberCount: 1250,
    industry: 'Technology',
    createdAt: '2023-01-15',
    keyMembers: [
      { id: '1', name: 'John Doe', avatar: '/placeholder.svg?height=32&width=32' },
      { id: '2', name: 'Jane Smith', avatar: '/placeholder.svg?height=32&width=32' },
      { id: '3', name: 'Bob Johnson', avatar: '/placeholder.svg?height=32&width=32' },
    ],
    level: 8,
    badges: ['Top Rated', 'Fast Delivery', 'Expert'],
    completedProjects: 230,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Digital Marketing Wizards',
    description: 'Expert digital marketers specializing in SEO, content marketing, and social media strategies to boost your online presence.',
    memberCount: 875,
    industry: 'Marketing',
    createdAt: '2023-03-22',
    keyMembers: [
      { id: '4', name: 'Alice Brown', avatar: '/placeholder.svg?height=32&width=32' },
      { id: '5', name: 'Charlie Davis', avatar: '/placeholder.svg?height=32&width=32' },
    ],
    level: 7,
    badges: ['Rising Talent', 'Client Favorite'],
    completedProjects: 180,
    rating: 4.7,
  },
  {
    id: '3',
    name: 'UI/UX Design Innovators',
    description: 'Creative designers crafting beautiful and intuitive user interfaces and experiences for web and mobile applications.',
    memberCount: 620,
    industry: 'Design',
    createdAt: '2023-05-10',
    keyMembers: [
      { id: '6', name: 'Eva Green', avatar: '/placeholder.svg?height=32&width=32' },
      { id: '7', name: 'Frank White', avatar: '/placeholder.svg?height=32&width=32' },
    ],
    level: 6,
    badges: ['Design Excellence', 'Innovative Solutions'],
    completedProjects: 150,
    rating: 4.8,
  },
]

export default function EnhancedGuildShowcase() {
  const [guilds, setGuilds] = useState(mockGuilds)
  const [searchTerm, setSearchTerm] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [sortBy, setSortBy] = useState('')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
    // Implement search logic here
  }

  const handleIndustryFilter = (value) => {
    setIndustryFilter(value)
    // Implement industry filter logic here
  }

  const handleSort = (value) => {
    setSortBy(value)
    // Implement sorting logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-black lg:text-5xl mb-4">
          Discover Extraordinary <span className="underline-guild relative" >Guilds</span>
        </h1>
        <p className="text-sm md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Unleash your potential by joining forces with elite freelancers. 
          Explore our curated collection of high-performing guilds and elevate your career to new heights.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search guilds..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border border-gray-200 px-2 rounded-md bg-white "
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <Select onValueChange={handleIndustryFilter}>
          <SelectTrigger className="w-full  md:w-[180px] border border-gray-200 px-2 text-black rounded-md bg-white">
            <SelectValue placeholder="Filter by Industry" className="text-black" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={handleSort}>
          <SelectTrigger className="w-full md:w-[180px] border border-gray-200 px-2 text-black rounded-md bg-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="memberCount">Member Count</SelectItem>
            <SelectItem value="creationDate">Creation Date</SelectItem>
            <SelectItem value="level">Guild Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {guilds.map((guild) => (
          <Card key={guild.id} className="w-full hover:shadow-lg hover:border hover:border-primary hover:border-opacity-50 transition-shadow duration-300 group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{guild.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{guild.industry}</p>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-bold">{guild.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{guild.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold mb-2">Guild Stats</h4>
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{guild.memberCount} members</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">Created on 1/15/2023</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span className="text-sm">{guild.completedProjects} projects completed</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Guild Prestige</h4>
                  <div className="flex items-center mb-2">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                    <span className="text-lg font-bold mr-2">Level {guild.level}</span>
                    <Progress value={guild.level * 10} className="flex-grow" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {guild.badges.map((badge, index) => (
                      <Badge key={index} variant="secondary">
                        <Award className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Members</h4>
                <div className="flex -space-x-2 overflow-hidden">
                  {guild.keyMembers.map((member) => (
                    <Avatar key={member.id} className="border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full group-hover:bg-primary transition-all ease-in-out duration-300">Join Guild</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}