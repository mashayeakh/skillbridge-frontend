"use client";

import { Languages } from "lucide-react";
import { Button } from "../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";

const Language = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Languages className="h-4 w-4" />
          Language
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={setLanguage} value={language}>
          <DropdownMenuRadioItem value="en">
            <span className="flex items-center gap-2">
              <span>🇺🇸</span>
              <span>English</span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="es">
            <span className="flex items-center gap-2">
              <span>🇪🇸</span>
              <span>Español</span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="fr">
            <span className="flex items-center gap-2">
              <span>🇫🇷</span>
              <span>Français</span>
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="de">
            <span className="flex items-center gap-2">
              <span>🇩🇪</span>
              <span>Deutsch</span>
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;