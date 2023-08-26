import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Icon,
  Stack,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router";
import PageName from "../../components/PageName";
import { PAGE_LINKS } from "../../constants/layout";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <PageName name="Dashboard" />
      <Box display="flex" flexDirection="row">
        <Stack gap={1} flex={1}>
          {PAGE_LINKS.map((link) => (
            <Card key={`link-${link.title}`} variant="outlined">
              <CardActionArea onClick={() => navigate(link.route)}>
                <CardHeader
                  avatar={<Icon fontSize="large">{link.icon}</Icon>}
                  title={link.title}
                  titleTypographyProps={{ fontSize: 18, fontWeight: "400" }}
                  subheader={link.subtitle}
                />
              </CardActionArea>
            </Card>
          ))}
        </Stack>
        <Box marginX={2} display="flex" flexDirection="row" flex={1}>
          <Icon sx={{ color: "primary.main", fontSize: 84 }}>find_in_page</Icon>
          <Stack>
            <Typography variant="h5">ScrapThatPage!</Typography>
            <Typography variant="subtitle1">
              v{window.scraper.version}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
