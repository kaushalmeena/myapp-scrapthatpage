import { FindInPage } from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import PageName from "../../components/PageName";
import { PAGE_LINKS } from "../../constants/layout";

function HomeScreen() {
  const navigate = useNavigate();
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.scraper.getVersion().then((version) => setVersion(`v${version}`));
  }, []);

  return (
    <>
      <PageName name="Home" />
      <Box display="flex" flexDirection="row">
        <Stack gap={1} flex={1}>
          {PAGE_LINKS.map(({ title, subtitle, route, Icon }) => (
            <Card key={`card-${title}`} variant="outlined">
              <CardActionArea onClick={() => navigate(route)}>
                <CardHeader
                  avatar={<Icon fontSize="large" />}
                  title={title}
                  titleTypographyProps={{ fontSize: 18, fontWeight: "400" }}
                  subheader={subtitle}
                />
              </CardActionArea>
            </Card>
          ))}
        </Stack>
        <Box marginX={2} display="flex" flexDirection="row" flex={1}>
          <FindInPage sx={{ color: "primary.main", fontSize: 84 }} />
          <Stack>
            <Typography variant="h5">ScrapThatPage!</Typography>
            <Typography variant="subtitle1">{version}</Typography>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default HomeScreen;
