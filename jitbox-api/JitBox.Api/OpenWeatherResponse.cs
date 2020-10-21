using System.Collections.Generic;

public class OpenWeatherResponse
{
    public string Name { get; set; }
    public IEnumerable<WeatherDescription> Weather { get; set; }
    public Main Main { get; set; }
}
public class WeatherDescription
{
    public string Main { get; set; }
    public string Description { get; set; }
}

public class Main
{
    public string Temp { get; set; }
}