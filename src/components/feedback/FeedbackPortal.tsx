"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline, FlagIcon, PhotoIcon } from '@heroicons/react/24/outline';
import {
  Bar,
  BarChart,
  Cell,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import { analyseSentiment } from '@/lib/sentiment';
import type { Review } from '@/types';
import { useData } from '@/context/DataContext';

export const FeedbackPortal = () => {
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const { reviews: remoteReviews, submitReview, loyalty } = useData();
  const [reviews, setReviews] = useState<Review[]>(remoteReviews);

  useEffect(() => {
    setReviews(remoteReviews);
  }, [remoteReviews]);

  const sentimentStats = useMemo(() => {
    const bands = [
      { label: 'Joyful', range: [0.6, 1], color: '#FF7F50' },
      { label: 'Balanced', range: [0.2, 0.6], color: '#FFD700' },
      { label: 'Constructive', range: [-1, 0.2], color: '#3CB371' }
    ];
    return bands.map((band) => ({
      band: band.label,
      count: reviews.filter((review) => review.sentimentScore >= band.range[0] && review.sentimentScore < band.range[1]).length,
      color: band.color
    }));
  }, [reviews]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!comment.trim()) return;

    const sentiment = analyseSentiment(comment);
    const newReview: Review = {
      id: `review-${Date.now()}`,
      dishId: 'dish-masala-dosa',
      rating: selectedRating,
      comment,
      sentimentScore: sentiment,
      user: {
        name: 'Guest Foodie',
        avatarColor: '#FF7F50',
        membershipTier: 'silver'
      },
      createdAt: new Date().toISOString(),
      photos,
      flagged: false
    };
    setReviews((prev) => [newReview, ...prev]);
    void submitReview(newReview);
    setComment('');
    setPhotos([]);
    setSelectedRating(5);
  };

  const toggleFlag = (id: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id
          ? {
              ...review,
              flagged: !review.flagged
            }
          : review
      )
    );
  };

  return (
    <section id="feedback" className="mt-16 rounded-3xl bg-white/85 p-8 shadow-lg shadow-saffron/20">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-saffron">Community feedback</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Taste memories & experience insights
          </h2>
        </div>
        <p className="max-w-lg text-sm text-slate-500">
          Every review powers our sentiment engine to elevate dishes, reward loyalty, and guide dietary journeys.
        </p>
      </header>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form className="space-y-5 rounded-2xl border border-cardamom/30 bg-jasmine p-6 shadow-inner" onSubmit={handleSubmit} aria-label="Submit feedback form">
          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Rate your dish</legend>
            <div className="mt-3 flex items-center gap-2">
              {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedRating(value)}
                  className="p-1"
                  aria-label={`Give ${value} star rating`}
                >
                  {selectedRating >= value ? (
                    <StarSolid className="h-8 w-8 text-saffron" aria-hidden />
                  ) : (
                    <StarOutline className="h-8 w-8 text-slate-300" aria-hidden />
                  )}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">
            Share your experience
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-saffron/20 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-cardamom focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cardamom"
              rows={4}
              placeholder="Talk about flavours, service, ambience or anything else."
              aria-describedby="sentiment-indicator"
            />
          </label>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cardamom">Add photos</p>
            <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-saffron/40 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm transition hover:border-cardamom">
              <PhotoIcon className="h-5 w-5 text-saffron" aria-hidden />
              <span>Upload meal snapshots (max 3)</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []).slice(0, 3);
                  files.forEach((file) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setPhotos((prev) => [...prev, reader.result as string]);
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />
            </label>
            {photos.length > 0 && (
              <div className="mt-3 flex gap-3">
                {photos.map((photo) => (
                  <div key={photo} className="h-14 w-14 min-w-[56px] overflow-hidden rounded-xl border border-saffron/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Uploaded dish preview" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-cardamom px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-lg shadow-cardamom/30 transition hover:bg-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
          >
            Submit feedback
          </button>
        </form>

        <div className="space-y-6">
          <div className="rounded-2xl border border-saffron/30 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cardamom">Sentiment overview</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">Community pulse</h3>
              </div>
              <span id="sentiment-indicator" className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">
                AI-assisted
              </span>
            </div>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentStats}>
                  <XAxis dataKey="band" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <RechartTooltip cursor={{ fill: '#FFF8E7' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {sentimentStats.map((entry) => (
                      <Cell key={entry.band} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-cardamom/20 bg-white/90 p-5 shadow-sm">
                <header className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: review.user.avatarColor }}
                    >
                      {review.user.name.substring(0, 2)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.user.name}</p>
                      <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFlag(review.id)}
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest transition ${
                      review.flagged
                        ? 'border-red-500 bg-red-50 text-red-600'
                        : 'border-saffron/30 text-slate-500 hover:border-red-500 hover:text-red-600'
                    }`}
                    aria-pressed={review.flagged}
                  >
                    <FlagIcon className="h-4 w-4" aria-hidden />
                    {review.flagged ? 'Flagged' : 'Report'}
                  </button>
                </header>
                <div className="mt-3 flex items-center gap-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <StarSolid
                      key={index}
                      className={`h-4 w-4 ${index + 1 <= review.rating ? 'text-saffron' : 'text-slate-200'}`}
                      aria-hidden
                    />
                  ))}
                  <span className="rounded-full bg-cardamom/10 px-2 py-1 text-[11px] font-semibold text-cardamom">
                    {loyalty.tiers.find((tier) => tier.id === review.user.membershipTier)?.name ?? 'Guest'}
                  </span>
                  <span className="text-xs text-slate-400">Sentiment {review.sentimentScore > 0 ? '+' : ''}{review.sentimentScore}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{review.comment}</p>
                {review.photos.length > 0 && (
                  <div className="mt-3 flex gap-3">
                    {review.photos.map((photo) => (
                      <div key={photo} className="h-16 w-16 overflow-hidden rounded-xl border border-saffron/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photo} alt="User submitted" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
