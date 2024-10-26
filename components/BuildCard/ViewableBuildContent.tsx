import _ from "lodash";
import Image from "next/image";

import { CardContent } from "@/components/ui/card";
import { Build } from "@/types";

interface ViewableBuildContentProps {
  build: Build;
}

const ViewableBuildContent: React.FC<ViewableBuildContentProps> = ({ build }) => {
  return (
    <CardContent>
      <div className="space-y-2">
        <div className="flex items-center">
          <strong className="mr-2">Weapon:</strong>
          {build.weapon ? (
            <>
              <Image alt={build.weapon.name} className="mr-2" height={30} src={build.weapon.iconUrl} width={30} />
              {build.weapon.name}
            </>
          ) : (
            "Not set"
          )}
        </div>
        <div className="flex items-center">
          <strong className="mr-2">Artifact Sets:</strong>
          {!_.isEmpty(build.desiredArtifactSets) ? (
            <>
              {build.desiredArtifactSets.map((artifactSet) => (
                <>
                  <Image alt={artifactSet.name} className="mr-2" height={30} src={artifactSet.iconUrl} width={30} />
                  <p className="mr-2">{artifactSet.name}</p>
                </>
              ))}
            </>
          ) : (
            "None set"
          )}
        </div>
        <div>
          <strong className="mr-2">Desired Artifact Main Stats:</strong>
          {!_.isEmpty(build.desiredArtifactMainStats) ? (
            <ul className="list-disc list-inside">
              {Object.entries(build.desiredArtifactMainStats).map(([artifactType, stat]) => (
                <li key={artifactType}>
                  {artifactType}: {stat}
                </li>
              ))}
            </ul>
          ) : (
            "None Set"
          )}
        </div>
        <div>
          <strong className="mr-2">Desired Stats:</strong>
          {!_.isEmpty(build.desiredStats) ? (
            <ul className="list-disc list-inside">
              {build.desiredStats.map((stat) => (
                <li key={stat.stat}>
                  {stat.stat}: {stat.value}
                </li>
              ))}
            </ul>
          ) : (
            "None Set"
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default ViewableBuildContent;
