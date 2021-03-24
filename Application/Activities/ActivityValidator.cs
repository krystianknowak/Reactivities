using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(activiy => activiy.Title).NotEmpty();
            RuleFor(activiy => activiy.Description).NotEmpty();
            RuleFor(activiy => activiy.Date).NotEmpty();
            RuleFor(activiy => activiy.Category).NotEmpty();
            RuleFor(activiy => activiy.City).NotEmpty();
            RuleFor(activiy => activiy.Venue).NotEmpty();
        }
    }
}