import { FileSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { PAGE_LINKS } from "@/lib/navigation";

function HomeScreen() {
  const navigate = useNavigate();
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.scraper.getVersion().then((version) => setVersion(`v${version}`));
  }, []);

  return (
    <>
      <PageHeader title="Home" />
      <div className="flex gap-6">
        <div className="flex flex-1 flex-col gap-2">
          {PAGE_LINKS.map(({ title, subtitle, route, Icon }) => (
            <Card key={`card-${title}`} className="p-0">
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-4 rounded-xl p-4 text-left transition-colors hover:bg-accent"
                onClick={() => navigate(route)}
              >
                <Icon className="size-8 text-primary" />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
              </button>
            </Card>
          ))}
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <FileSearch className="size-20 text-primary" />
          <h2 className="text-2xl font-semibold">ScrapThatPage!</h2>
          <p className="text-muted-foreground">{version}</p>
        </div>
      </div>
    </>
  );
}

export default HomeScreen;
