'use client';
const LocationPage = () => {
    return (
        <div className="relative h-20 w-full  overflow-hidden shadow-xl bg-gray-100">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3203.4918427871635!2d72.68744946066737!3d23.038858321505764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87a3d28e0103%3A0xef1e76eea92cfd48!2sVersatile%20Industrial%20Estate!5e0!3m2!1sen!2sin!4v1751108307488!5m2!1sen!2sin"
                className="absolute inset-0 w-full aspect-auto"
                loading="lazy"
                allowFullScreen
            />
        </div>
    );
};

export default LocationPage;