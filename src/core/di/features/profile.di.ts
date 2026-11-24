import { asFunction } from "awilix";

import type { ProfileRemoteSource } from "../../../features/profile/data/source/profile.remote.source";
import { ProfileRemoteSourceImpl } from "../../../features/profile/data/source/profile.remote.source.impl";
import { ProfileRepositoryImpl } from "../../../features/profile/data/repositories/profile.repository.impl";
import type { ProfileRepository } from "../../../features/profile/domain/repositories/profile.repository";

import { GetMyProfile } from "../../../features/profile/domain/usecases/get.my.profile";
import { GetProfile } from "../../../features/profile/domain/usecases/get.profile";
import { UpdateProfile } from "../../../features/profile/domain/usecases/update.profile";
import { RemoveFavorite } from "../../../features/profile/domain/usecases/remove.favorite";
import { AddFavorite } from "../../../features/profile/domain/usecases/add.favorite";
import type { SocialSource } from "../../../features/profile/data/source/social.source";
import { SocialRemoteSourceImpl } from "../../../features/profile/data/source/social.remote.source.impl";
import { SocialRepositoryImpl } from "../../../features/profile/data/repositories/social.repository.impl";
import type { SocialRepository } from "../../../features/profile/domain/repositories/social.repository";
import { GetFollowers } from "../../../features/profile/domain/usecases/get.followers";
import { GetFollowing } from "../../../features/profile/domain/usecases/get.following";
import { GetRelationship } from "../../../features/profile/domain/usecases/get.relationship";
import { FollowUser } from "../../../features/profile/domain/usecases/follow.user";
import { UnfollowUser } from "../../../features/profile/domain/usecases/unfollow.user";
import { GetFollowRequests } from "../../../features/profile/domain/usecases/get.follow.requests";
import { AnswerFollowRequest } from "../../../features/profile/domain/usecases/answer.follow.request";

type SR = { socialRepository: SocialRepository };

export const profileFeatureDi = {
  // ------- data source -------
  profileSource: asFunction(() => new ProfileRemoteSourceImpl()).singleton(),

  // ------- repository -------
  profileRepository: asFunction(
    ({ profileSource }: { profileSource: ProfileRemoteSource }) =>
      new ProfileRepositoryImpl(profileSource),
  ).singleton(),

  // ------- usecases -------
  getMyProfile: asFunction(
    ({ profileRepository }: { profileRepository: ProfileRepository }) =>
      new GetMyProfile(profileRepository),
  ).singleton(),

  getProfile: asFunction(
    ({ profileRepository }: { profileRepository: ProfileRepository }) =>
      new GetProfile(profileRepository),
  ).singleton(),

  updateProfile: asFunction(
    ({ profileRepository }: { profileRepository: ProfileRepository }) =>
      new UpdateProfile(profileRepository),
  ).singleton(),

  addFavorite: asFunction(
    ({ profileRepository }: { profileRepository: ProfileRepository }) =>
      new AddFavorite(profileRepository),
  ).singleton(),

  removeFavorite: asFunction(
    ({ profileRepository }: { profileRepository: ProfileRepository }) =>
      new RemoveFavorite(profileRepository),
  ).singleton(),

  // ------- seguidores (HU 11) -------
  socialSource: asFunction(() => new SocialRemoteSourceImpl()).singleton(),
  socialRepository: asFunction(
    ({ socialSource }: { socialSource: SocialSource }) => new SocialRepositoryImpl(socialSource),
  ).singleton(),
  getFollowers: asFunction(({ socialRepository }: SR) => new GetFollowers(socialRepository)).singleton(),
  getFollowing: asFunction(({ socialRepository }: SR) => new GetFollowing(socialRepository)).singleton(),
  getRelationship: asFunction(({ socialRepository }: SR) => new GetRelationship(socialRepository)).singleton(),
  followUser: asFunction(({ socialRepository }: SR) => new FollowUser(socialRepository)).singleton(),
  unfollowUser: asFunction(({ socialRepository }: SR) => new UnfollowUser(socialRepository)).singleton(),
  getFollowRequests: asFunction(({ socialRepository }: SR) => new GetFollowRequests(socialRepository)).singleton(),
  answerFollowRequest: asFunction(({ socialRepository }: SR) => new AnswerFollowRequest(socialRepository)).singleton(),
};
