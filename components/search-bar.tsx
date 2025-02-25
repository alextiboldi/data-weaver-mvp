"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (value: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch(searchValue);
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
      <Input
        type="text"
        placeholder="Search in database..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button type="submit" onClick={handleSearch} disabled={isLoading}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
