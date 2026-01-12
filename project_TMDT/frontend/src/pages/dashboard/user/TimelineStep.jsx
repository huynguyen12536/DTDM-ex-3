import React from 'react';

const TimelineStep = ({ step, order, isCompleted, isCurrent, icon, description, isLastStep }) => {
    // Conditional classes for icon background and text colors
    const iconBgColor = isCompleted || isCurrent ? `bg-${icon.bgColor}` : 'bg-gray-100';
    const iconTextColor = isCompleted || isCurrent ? 'text-white' : `text-${icon.textColor}`;
    const connectorColor = isCompleted ? 'bg-blue-500' : 'bg-gray-200';
    const labelTextColor = isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500';
    const descriptionTextColor = isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500';

    const renderStepTime = () => {
        if (!order.createdAt) return 'Chưa có thời gian';

        const createdAt = new Date(order.createdAt);

        let daysToAdd = 0;
        switch (step.status) {
            case 'processing':
                daysToAdd = 1;
                break;
            case 'shipped':
                daysToAdd = 3;
                break;
            case 'delivered':
                daysToAdd = 4;
                break;
            case 'completed':
                daysToAdd = 5;
                break;
            default:
                daysToAdd = 0;
                break;
        }

        const stepDate = new Date(createdAt);
        stepDate.setDate(stepDate.getDate() + daysToAdd);

        if (isCompleted || isCurrent) {
            return stepDate.toLocaleString('vi-VN');
        }
        return 'Chưa đến';
    };

    return (
        <li className="relative mb-6 sm:mb-0 sm:pl-10">
            <div className="flex items-center">
                <div
                    className={`z-10 flex items-center justify-center w-6 h-6 ${iconBgColor} ${iconTextColor} rounded-full ring-0 ring-white dark:ring-gray-900 shrink-0`}
                >
                    <i className={`ri-${icon.iconName} text-xl`}></i>
                </div>
                {!isLastStep && (
                    <div
                        className={`hidden sm:flex w-full h-0.5 ${connectorColor} dark:bg-gray-700`}
                    ></div>
                )}
            </div>
            <div className="mt-3 sm:pe-8">
                <h3 className={`font-semibold text-lg ${labelTextColor} dark:text-white`}>
                    {step.label}
                </h3>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    {renderStepTime()}
                </time>
                <p className={`text-base font-normal ${descriptionTextColor} dark:text-gray-400`}>
                    {description}
                </p>
            </div>
        </li>
    );
};

export default TimelineStep;
