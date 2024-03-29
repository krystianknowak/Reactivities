using System.Linq;
using Application.Activities;
using AutoMapper;
using Domain;

namespace Application.Core
{
  public class MappingProfiles : Profile
  {
    public MappingProfiles()
    {
      CreateMap<Activity, Activity>();
      CreateMap<Activity, ActivityDto>()
        .ForMember(
          destinationMember => destinationMember.HostUserName,
          options => options.MapFrom(
            sourceMember => sourceMember.Attendees.FirstOrDefault(activityAttende => activityAttende.IsHost).AppUser.UserName
          )
        );
      CreateMap<ActivityAttendee, Profiles.Profile>()
        .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
        .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
        .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
    }
  }
}